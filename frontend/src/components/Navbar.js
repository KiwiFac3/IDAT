import { React, Link } from '../imports';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/options">Options</Link>
      <Link to="/charts">Charts</Link>
      <Link to="/budget">Budget</Link>
    </nav>
  );
}

export default Navbar;
