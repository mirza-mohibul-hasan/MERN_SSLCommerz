import { Link } from "react-router-dom";

const App = () => {
  const book = {
    id: 123456789,
    name: "Harry Porter",
    author: "J. K. Rowling",
    price: 120.54,
    description:
      "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry.",
    image:
      "https://gitmind.com/wp-content/uploads/2023/04/harry-potter-in-order.jpg",
  };
  return (
    <div className="w-8/12 mx-auto mt-10">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src={book.image} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{book.name}</h2>
          <p>Price: {book.price}</p>
          <p>Author: {book.author}</p>
          <p>{book.description}</p>
          <div className="card-actions justify-end">
            <Link to={`/bookdetails/${book.id}`} book={book}>
              <button className="btn btn-primary">Buy Now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
