import { Star } from "lucide-react";
import { IReview } from "../../../../interfaces/api.products.res.type";
import { IsoToDate } from "../../../../utils/iso_to_date";

const CustomerReview = ({
  reviews,
  rating,
}: {
  reviews: IReview[];
  rating: number;
}) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="flex items-center mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(rating)
                  ? "text-red-500 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-gray-600">{rating} out of 5</span>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "text-red-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold">
                {review.user.profile.firstName} {review.user.profile.lastName}
              </span>
            </div>
            <p className="text-gray-700 text-sm">
              {IsoToDate(review.createdAt)}
            </p>
            <p className="text-gray-700">{review.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReview;