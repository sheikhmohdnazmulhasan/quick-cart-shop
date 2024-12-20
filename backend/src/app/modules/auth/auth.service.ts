import { JwtPayload } from "jsonwebtoken";
import { bcryptOperation } from "../../../utils/bcrypt";
import { jwtOperation } from "../../../utils/jwt";
import prisma from "../../constants/prisma_constructor";
import { IServiceReturn } from "../../interfaces/service_return_type";
import { ILogin } from "../users/users.interface";
import { IChangePassword } from "./auth.interface";
import filteredUser from "../../../utils/filter_user";
import transporter from "../../../utils/nodemailer_transporter";
import config from "../../config";
import resetPasswordEmailTemplate from "../../emails/reset_password";

async function loginUserFromDb(payload: ILogin): Promise<IServiceReturn> {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isDeleted: false,
    },
    include: {
      profile: true,
      vendor: true,
    },
  });

  if (!user) {
    return {
      status: 404,
      success: false,
      message: "User not found with that email",
      data: null,
    };
  }

  if (user.status == "BLOCKED") {
    return {
      status: 400,
      success: false,
      message: "Account blocked",
      data: null,
    };
  }

  const isValidPassword = await bcryptOperation.comparePassword(
    payload.password,
    user.password
  );

  if (!isValidPassword) {
    return {
      status: 401,
      success: false,
      message: "Wrong Password",
      data: null,
    };
  }

  const assignedToken = jwtOperation.generateToken({
    email: user.email,
    id: user.id,
    role: user.role,
  });

  // const filteredUser = Object.fromEntries(
  //     Object.entries(user).filter(([key, value]) => value !== null && key !== 'password')
  // );

  return {
    status: 200,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken: assignedToken,
      user: filteredUser(user),
    },
  };
}

async function changePasswordIntoDb(
  user: JwtPayload,
  payload: IChangePassword
): Promise<IServiceReturn> {
  const userDb = await prisma.user.findUnique({
    where: {
      id: user.id,
      isDeleted: false,
    },
    include: {
      profile: true,
      vendor: true,
    },
  });

  if (!userDb) {
    return {
      status: 404,
      success: false,
      message: "User not found with that token",
      data: null,
    };
  }

  const isValidPassword = await bcryptOperation.comparePassword(
    payload.oldPassword,
    userDb.password
  );

  if (!isValidPassword) {
    return {
      status: 401,
      success: false,
      message: "Wrong password",
      data: null,
    };
  }

  const hashedPassword = await bcryptOperation.hashPassword(
    payload.newPassword
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    status: 200,
    success: true,
    message: "Password changed successfully",
    data: filteredUser(userDb),
  };
}

async function forgotPasswordIntoDb(email: string): Promise<IServiceReturn> {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isDeleted: false,
    },
    include: {
      profile: true,
      vendor: true,
    },
  });

  if (!user) {
    return {
      status: 404,
      success: false,
      message: "User not found with that email",
      data: null,
    };
  }

  const assignedToken = jwtOperation.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "30m"
  );

  const resetUrl = `${config.client_url}/auth/reset-password?token=${assignedToken}`;
  const sendEmail = await transporter.sendMail({
    to: user.email,
    subject: "Rest your password - QuickCart",
    html: resetPasswordEmailTemplate(resetUrl),
  });

  if (!sendEmail.accepted.length) {
    return {
      status: 400,
      success: false,
      message: "Failed to send Email",
      data: null,
    };
  }

  return {
    status: 200,
    success: true,
    message: "Email Send. Check inbox with spam/junk",
    data: filteredUser(user),
  };
}

async function resetPasswordIntoDb(
  user: JwtPayload,
  payload: { newPassword: string }
): Promise<IServiceReturn> {
  const _user = await prisma.user.findUnique({
    where: {
      id: user.id,
      isDeleted: false,
    },
  });

  if (!_user) {
    return {
      status: 404,
      success: false,
      message: "user not longer exist",
      data: null,
    };
  }

  const hashedPassword = await bcryptOperation.hashPassword(
    payload.newPassword
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    status: 200,
    success: true,
    message: "Account recovered successfully. Login with new password",
    data: filteredUser(_user),
  };
}

export const AuthServices = {
  loginUserFromDb,
  changePasswordIntoDb,
  forgotPasswordIntoDb,
  resetPasswordIntoDb,
};
