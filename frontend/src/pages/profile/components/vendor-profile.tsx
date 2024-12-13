import { ChangeEvent, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  Avatar,
  Typography,
  Descriptions,
  Badge,
  Button,
  Form,
  Input,
  message,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Camera } from "lucide-react";

const { Title, Text } = Typography;

interface VendorData {
  address: string;
  createdAt: string;
  description: string;
  email: string;
  id: string;
  isBlackListed: boolean;
  logo: string | null;
  name: string;
  phone: string;
  updatedAt: string;
}

export default function VendorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit } = useForm<VendorData>();

  const vendor: VendorData = {
    address: "Dhaka",
    createdAt: "2024-12-09T09:38:41.488Z",
    description: "eewewewewewe",
    email: "vendor@example.com",
    id: "d6f44113-514a-4e67-ae7f-fc48d07e1e33",
    isBlackListed: false,
    logo: null,
    name: "Nazmul's Vendor",
    phone: "+8801772757378",
    updatedAt: "2024-12-12T17:14:08.289Z",
  };

  async function handleChangeProfilePicture(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files);
    }
  }

  const onSubmit = (data: VendorData) => {
    console.log("Form data submitted:", data);
    // Here you would typically send the data to your API
    message.success("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card
        extra={
          <Button
            icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={() =>
              isEditing ? handleSubmit(onSubmit)() : setIsEditing(true)
            }
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        }
      >
        <div className="flex items-center mb-4 relative">
          <Avatar size={64} src={vendor.logo}>
            {vendor.name.charAt(0)}
          </Avatar>
          {isEditing && (
            <label
              className="absolute inset-0 w-16 h-16 top-1.5 flex items-center justify-center bg-black bg-opacity-20 opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
              htmlFor="profile-picture"
            >
              <Camera className="text-white" size={20} />
            </label>
          )}
          <input
            accept="image/*"
            className="hidden"
            id="profile-picture"
            type="file"
            onChange={handleChangeProfilePicture}
          />
          <div className="ml-4">
            <Title level={2}>{vendor.name}</Title>
            <Text type="secondary">{vendor.email}</Text>
          </div>
        </div>

        <Form layout="vertical">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Address">
              {isEditing ? (
                <Controller
                  name="address"
                  control={control}
                  defaultValue={vendor.address}
                  render={({ field }) => <Input {...field} />}
                />
              ) : (
                vendor.address
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {isEditing ? (
                <Controller
                  name="phone"
                  control={control}
                  defaultValue={vendor.phone}
                  render={({ field }) => <Input {...field} />}
                />
              ) : (
                vendor.phone
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {isEditing ? (
                <Controller
                  name="description"
                  control={control}
                  defaultValue={vendor.description}
                  render={({ field }) => <Input.TextArea {...field} />}
                />
              ) : (
                vendor.description
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(vendor.createdAt).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {new Date(vendor.updatedAt).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge
                status={vendor.isBlackListed ? "error" : "success"}
                text={vendor.isBlackListed ? "Blacklisted" : "Active"}
              />
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </Card>
    </div>
  );
}
