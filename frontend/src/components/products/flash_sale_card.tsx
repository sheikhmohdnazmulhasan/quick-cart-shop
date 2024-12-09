import { FC } from "react";
import { IProduct } from "../../interfaces/api.products.res.type";
import { Button } from "antd";
const FlashSaleCard: FC<IProduct> = ({ title, imgs, price, avgRating }) => {
  return (
    <section className="p-5 py-10 bg-red-50 rounded-md text-center transform duration-500 hover:-translate-y-2 cursor-pointer">
      <img src={imgs[0]} alt={title} />
      <div className="space-x-1 flex justify-center mt-10">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 mx-px fill-current ${
              index < parseInt(String(avgRating))
                ? "text-orange-600"
                : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
          >
            <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z" />
          </svg>
        ))}
      </div>
      <h1 className="text-2xl my-5">{title}</h1>
      {/* <p className="mb-5">{description.slice(0, 240)}</p> */}
      <h2 className="font-semibold  text-3xl items-center mb-5">${price}</h2>
      <Button variant="solid" color="danger" size="large">
        Add To Cart
      </Button>
    </section>
  );
};

export default FlashSaleCard;
