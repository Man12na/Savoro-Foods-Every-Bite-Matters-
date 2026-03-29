import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrders,
  cancelOrder,
  completeOrder,
} from "../Redux/Slice/orderSlice";
import "./Orders.css";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleCancel = (id) => {
    dispatch(cancelOrder(id));
  };

  const handleComplete = (id) => {
    dispatch(completeOrder(id));
  };

  if (loading) return <p className="orders-loading">Loading orders...</p>;
  if (error) return <p className="orders-error">{error}</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">
        {user?.is_seller ? "Orders for Your Products" : "My Orders"}
      </h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              
              {/* Header */}
              <div className="order-header">
                <span>Order ID: {order.id}</span>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="order-items">
                {order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>
                        Product: {item.product?.name || `ID ${item.product}`}
                      </span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.unit_price}</span>
                    </div>
                  ))
                ) : (
                  <p>No items in this order</p>
                )}
              </div>

              {/* Total */}
              <div className="order-footer">
                <span>Total:</span>
                <strong>
                  ₹
                  {order.items.reduce(
                    (sum, item) =>
                      sum + parseFloat(item.unit_price) * item.quantity,
                    0
                  )}
                </strong>
              </div>

              {/* Actions */}
              <div className="order-actions">

                {/* Customer Cancel */}
                {!user?.is_seller && order.status === "pending" && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel Order
                  </button>
                )}

                {/* Seller Complete */}
                {user?.is_seller && order.status === "pending" && (
                  <button
                    className="complete-btn"
                    onClick={() => handleComplete(order.id)}
                  >
                    Mark Complete
                  </button>
                )}

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;