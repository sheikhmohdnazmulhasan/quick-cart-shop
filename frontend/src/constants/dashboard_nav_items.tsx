import {
  Puzzle,
  ShoppingBag,
  ShoppingBasket,
  SquareChartGantt,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const VENDOR = [
  {
    key: "1",
    icon: <SquareChartGantt />,
    label: <Link to="products">All Products</Link>,
  },
  {
    key: "2",
    icon: <ShoppingBasket />,
    label: <Link to="add-product">Add Product</Link>,
  },
  {
    key: "3",
    icon: <ShoppingBag />,
    label: <Link to="orders">Orders</Link>,
  },
  {
    key: "4",
    icon: <Puzzle />,
    label: <Link to="coupons">Coupons</Link>,
  },
  {
    key: "5",
    icon: <Star />,
    label: <Link to="reviews">Reviews</Link>,
  },
];

const ADMIN = [
  {
    key: "1",
    icon: <SquareChartGantt />,
    label: <Link to="products">All Products</Link>,
  },
  {
    key: "2",
    icon: <ShoppingBag />,
    label: <Link to="orders">Orders</Link>,
  },
  {
    key: "3",
    icon: <Puzzle />,
    label: <Link to="coupons">Coupons</Link>,
  },
  {
    key: "4",
    icon: <Star />,
    label: <Link to="reviews">Reviews</Link>,
  },
];

export const DashboardNavItems = {
  VENDOR,
  ADMIN,
};
