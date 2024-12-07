import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Use this if React Router is available
import { ArrowRight } from "lucide-react";

interface FlashSaleItem {
    id: number;
    name: string;
    originalPrice: number;
    salePrice: number;
    image: string;
}

const flashSaleItems: FlashSaleItem[] = [
    {
        id: 1,
        name: "Wireless Noise-Cancelling Headphones",
        originalPrice: 299.99,
        salePrice: 199.99,
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 2,
        name: "Smart Home Security Camera",
        originalPrice: 149.99,
        salePrice: 89.99,
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 3,
        name: "Fitness Tracker Watch",
        originalPrice: 99.99,
        salePrice: 69.99,
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: 4,
        name: "Fitness Tracker Watch",
        originalPrice: 99.99,
        salePrice: 69.99,
        image: "/placeholder.svg?height=200&width=200",
    },
];

export default function FlashSale() {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Flash Sale</h2>
                    <div className="text-danger-500 font-bold text-xl">
                        Ends in: <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
                    {flashSaleItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex-none bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 truncate">
                                    {item.name}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-danger-500 font-bold text-xl">
                                            ${item.salePrice.toFixed(2)}
                                        </span>
                                        <span className="text-gray-400 line-through ml-2">
                                            ${item.originalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <span className="bg-danger-500 text-white px-2 py-1 rounded-full text-sm">
                                        {Math.round(
                                            (1 - item.salePrice / item.originalPrice) * 100
                                        )}% OFF
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <button className="w-full bg-danger-500 hover:bg-danger-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    {/* Replace Link with <a> if not using React Router */}
                    <Link
                        to="/flash-sale"
                        className="inline-flex items-center text-danger-500 hover:underline"
                    >
                        View All Flash Sale Items <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}