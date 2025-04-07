import React from "react";
import { useRouter } from "next/navigation";

interface CartItemProps {
  _id: string;
  BookID: string;
  BookName: string;
  BookImage: string;
  count: number;
  quantity: number;
  price: number;
  onDelete: (cartItemId: string) => Promise<void>;
  onUpdateCount: (itemId: string, newQuantity: number) => Promise<void>;
  updatingItem: boolean;
}

const CartItemBox = (props: CartItemProps) => {
  const {
    _id,
    BookID,
    BookName,
    BookImage,
    count,
    price,
    onDelete,
    onUpdateCount,
    updatingItem
  } = props;
  
  const router = useRouter();

  return (
    <div className="w-full">
      <div
        className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md border border-gray-200"
      >
        <div className="flex-shrink-0">
          <img
            src={BookImage}
            alt={BookName}
            onClick={() => router.push(`/book/${BookID}`)}
            className="w-20 h-28 object-cover rounded-md shadow-sm cursor-pointer"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {BookName}
          </h3>
          
          <p className="text-sm text-gray-600 mt-1">
            Price: ${price.toFixed(2)}
          </p>
          
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm text-gray-600">Quantity:</span>
            <button
              onClick={() => onUpdateCount(_id, count - 1)}
              disabled={count <= 1 || updatingItem}
              className={`text-red-500 hover:text-red-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center ${
                (count <= 1 || updatingItem) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              -
            </button>
            <span className="font-medium w-6 text-center">{count}</span>
            <button
              onClick={() => onUpdateCount(_id, count + 1)}
              disabled={updatingItem}
              className={`text-blue-500 hover:text-blue-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center ${
                updatingItem ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              +
            </button>
            
            {updatingItem && (
              <span className="ml-2 text-xs text-gray-500">Updating...</span>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-700 mt-2">
            Subtotal: ${(price * count).toFixed(2)}
          </p>
        </div>
        
        <div>
          <button
            onClick={() => onDelete(_id)}
            disabled={updatingItem}
            className={`text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 ${
              updatingItem ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemBox;