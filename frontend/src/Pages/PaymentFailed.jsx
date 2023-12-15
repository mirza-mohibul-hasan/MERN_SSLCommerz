import { useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentFailed = () => {
  useEffect(() => {
    Swal.fire({
      title: "Payment Failed",
      text: "You clicked the button!",
      icon: "error",
    });
  }, []);
  return (
    <div>
      <Link to="/" className="btn btn-warning inline-flex justify-center">
        Home
      </Link>
    </div>
  );
};

export default PaymentFailed;
