import { Badge, Button } from "antd";
import { ShoppingCart } from "lucide-react";
import { FC, useState } from "react";
import { IProduct } from "../../../../interfaces/api.products.res.type";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const AddToCart: FC<IProduct> = ({ quantity }) => {
  const ButtonGroup = Button.Group;
  const [count, setCount] = useState<number>(1);

  return (
    <div className="flex items-center space-x-4 mb-6">
      <ButtonGroup size="large">
        <Button
          onClick={() => setCount((prev) => prev - 1)}
          disabled={count <= 1}
          icon={<MinusOutlined />}
        />
        <Button
          onClick={() => setCount((prev) => prev + 1)}
          disabled={count >= quantity}
          icon={<PlusOutlined />}
        />
      </ButtonGroup>
      <Badge count={count}>
        <Button
          disabled={quantity < 1}
          variant="solid"
          size="large"
          color="danger"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </Badge>
    </div>
  );
};

export default AddToCart;
