import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, []);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    data.productId = book?._id;
    fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => window.location.replace(result.url));
  };
  return (
    <div className="w-8/12 mx-auto mt-10 flex gap-10">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src={book?.image} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{book?.name}</h2>
          <p>Price: {book?.price}</p>
          <p>Author: {book?.author}</p>
          <p>{book?.description}</p>
        </div>
      </div>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 border p-3 rounded-lg"
        >
          <input
            placeholder="Name"
            {...register("name", { required: true })}
            className="input input-bordered input-sm w-full max-w-md"
          />
          <select
            {...register("curency")}
            className="input input-bordered input-sm w-full max-w-md"
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="RMB">RMB</option>
            <option value="Euro">Euro</option>
          </select>
          <input
            placeholder="Post Code"
            {...register("postcode", { required: true })}
            className="input input-bordered input-sm w-full max-w-md"
          />
          <input
            placeholder="Address"
            {...register("address", { required: true })}
            className="input input-bordered input-sm w-full max-w-md"
          />
          <input
            placeholder="Phone No"
            {...register("phone", { required: true })}
            className="input input-bordered input-sm w-full max-w-md"
          />

          <input
            type="submit"
            value="PAY"
            className="btn btn-outline btn-error text-white input input-bordered input-sm w-full max-w-md"
          />
        </form>
      </div>
    </div>
  );
};

export default BookDetails;
