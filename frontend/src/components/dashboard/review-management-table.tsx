import React, { useState } from "react";
import { Table, Rate, Card, List, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IReviewResponse } from "../../interfaces/api.res.reviews.type";
import ReviewResponseDrawer from "./review-response-drawer";
import { Link } from "react-router-dom";
import { IVendorResponse } from "../../interfaces/api.products.res.type";
import ReviewResponseEditDrawer from "./response-edit.dawer";
import {
  useDeleteReviewMutation,
  useDeleteReviewResponseMutation,
} from "../../redux/features/reviews/reviews.api";
import { toast } from "sonner";

interface ReviewTableProps {
  reviews: IReviewResponse[];
  userRole: "VENDOR" | "ADMIN";
}

const ReviewTable: React.FC<ReviewTableProps> = ({ reviews, userRole }) => {
  const [deleteReviewResponse] = useDeleteReviewResponseMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [clickedReviewForResponse, setClickedReviewForResponse] = useState<
    string | null
  >(null);

  async function handleDeleteReviewResponse(responseId: string) {
    try {
      const res = await deleteReviewResponse({ responseId }).unwrap();
      if (res.success) {
        toast.success("Response deleted!");
      }
    } catch (error) {
      toast.error("Something bad happened");
      console.log("Error when deleting review response", error);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    try {
      const res = await deleteReview({ reviewId }).unwrap();
      if (res.success) {
        toast.success("Review successfully deleted");
      }
    } catch (error) {
      toast.error("Something bad happened");
      console.log("Error when deleting review", error);
    }
  }

  const [targetedResponseForEdit, setTargetedResponseForEdit] =
    useState<IVendorResponse | null>(null);

  const columns: ColumnsType<IReviewResponse> = [
    {
      title: "Product",
      dataIndex: ["product", "title"],
      key: "product",
      render: (title, record) => {
        const filteredProduct = reviews.find(
          (review: IReviewResponse) => review.product.id === record.product.id
        );
        return (
          <Link
            to={`/products/item/${filteredProduct?.product.id}`}
            target="_blank"
          >
            {title}
          </Link>
        );
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <span>{`${record.user?.profile.firstName} ${record.user?.profile.lastName}`}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => setClickedReviewForResponse(record.id)}
          >
            Respond
          </Button>
          {userRole === "ADMIN" && (
            <Popconfirm
              key="delete"
              description="Are you sure to delete this review?"
              title="Delete review"
              onConfirm={() => handleDeleteReview(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  if (userRole === "ADMIN") {
    columns.splice(3, 0, {
      title: "Vendor",
      dataIndex: ["product", "vendor", "name"],
      key: "vendor",
    });
  }

  const expandedRowRender = (record: IReviewResponse) => (
    <Card title="Review Details" style={{ margin: 16 }}>
      <p className="mb-2">
        <strong>Full Review:</strong> {record.description}
      </p>
      <List
        header={<div>Responses</div>}
        bordered
        dataSource={record.vendorResponse}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                onClick={() => setTargetedResponseForEdit(item)}
                size="small"
              >
                Edit
              </Button>,
              <Popconfirm
                key="delete"
                description="Are you sure to delete this response?"
                title="Delete response"
                onConfirm={() => handleDeleteReviewResponse(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" variant="filled" color="danger">
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <div>
              <p> {item.description}</p>
              <small> {new Date(item.createdAt).toLocaleString()}</small>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.description !== "",
        }}
        pagination={{ pageSize: 10 }}
      />
      {clickedReviewForResponse && (
        <ReviewResponseDrawer
          reviewId={clickedReviewForResponse}
          setReviewId={setClickedReviewForResponse}
        />
      )}

      {targetedResponseForEdit && (
        <ReviewResponseEditDrawer
          targetedResponse={targetedResponseForEdit}
          setTargetedResponse={setTargetedResponseForEdit}
        />
      )}
    </>
  );
};

export default ReviewTable;
