import React, { useState } from "react";
import { Table, Badge, Button, Descriptions, Space, Popover } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import {
  IOrderItem,
  IOrderUserProfile,
  IVendorOrder,
} from "../../../interfaces/api.order.res.type";
import { useUpdateOrderStatusMutation } from "../../../redux/features/orders/order.api";
import { toast } from "sonner";

const VendorOrderTable: React.FC<{ orders: IVendorOrder[] }> = ({ orders }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  async function handleUpdateStatus(
    orderId: string,
    actionType: "PROCESSING" | "DELIVERED" | "CANCELLED"
  ) {
    try {
      const res = await updateOrderStatus({ actionType, orderId });

      if (res.data.success) {
        toast.success("Order status Updated");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error("Error updating status:", error);
    }
  }

  const content = (orderId: string) => (
    <div className="flex gap-2">
      <Button
        size="small"
        variant="solid"
        color="danger"
        onClick={() => handleUpdateStatus(orderId, "CANCELLED")}
      >
        Cancel
      </Button>
      <Button
        size="small"
        type="primary"
        onClick={() => handleUpdateStatus(orderId, "PROCESSING")}
      >
        Processing
      </Button>
      <Button
        size="small"
        type="primary"
        onClick={() => handleUpdateStatus(orderId, "DELIVERED")}
      >
        Delivered
      </Button>
    </div>
  );

  const toggleExpand = (record: IVendorOrder) => {
    setExpandedRowKeys((keys) =>
      keys.includes(record.id)
        ? keys.filter((key) => key !== record.id)
        : [...keys, record.id]
    );
  };

  const columns: TableColumnsType<IVendorOrder> = [
    {
      title: "",
      key: "expand",
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          icon={
            expandedRowKeys.includes(record.id) ? (
              <DownOutlined />
            ) : (
              <RightOutlined />
            )
          }
          onClick={() => toggleExpand(record)}
        />
      ),
    },
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => id.slice(0, 8) + "...",
    },
    {
      title: "Customer",
      dataIndex: ["user", "profile"],
      key: "customer",
      render: (profile: IOrderUserProfile) =>
        `${profile.firstName} ${profile.lastName}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "totalItems",
      render: (items: IOrderItem[]) =>
        items.reduce((sum, item) => sum + item.quantity, 0),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={
            status === "PENDING"
              ? "warning"
              : status === "CANCELLED"
              ? "error"
              : status === "DELIVERED"
              ? "success"
              : "processing"
          }
          text={status}
        />
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus: string) => (
        <Badge
          status={paymentStatus === "PAID" ? "success" : "error"}
          text={paymentStatus}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: IVendorOrder) => (
        <Popover
          content={content(record.id)}
          title="Update order status"
          trigger="click"
        >
          <Button size="small">Update Status</Button>
        </Popover>
      ),
    },
  ];

  const expandedRowRender = (record: IVendorOrder) => {
    const itemColumns: TableColumnsType<IOrderItem> = [
      { title: "Product", dataIndex: ["product", "title"], key: "title" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      {
        title: "Price",
        dataIndex: ["product", "price"],
        key: "price",
        render: (price: number) => `$${price.toFixed(2)}`,
      },
      {
        title: "Discount",
        dataIndex: ["product", "discount"],
        key: "discount",
        render: (discount: number) => `${discount}%`,
      },
      {
        title: "Total",
        key: "total",
        render: (_, item) => {
          const discountedPrice =
            (item.product.price * (100 - item.product.discount)) / 100;
          return `$${(discountedPrice * item.quantity).toFixed(2)}`;
        },
      },
    ];

    return (
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Descriptions title="Customer Details" bordered column={1}>
          <Descriptions.Item label="Email">
            {record.user.profile.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {record.user.profile.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {record.user.profile.address}
          </Descriptions.Item>
        </Descriptions>
        <Table
          columns={itemColumns}
          dataSource={record.items}
          pagination={false}
          rowKey="id"
        />
      </Space>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={orders}
      expandable={{
        expandedRowRender,
        expandedRowKeys,
        onExpand: (_, record) => toggleExpand(record),
      }}
      rowKey="id"
    />
  );
};

export default VendorOrderTable;
