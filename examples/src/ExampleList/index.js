import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
};

function ExampleList({ examples }) {
  return (
    <ul>
      {examples.map(example => (
        <li key={example.slug}>
          <Link to={`/${example.slug}`}>{example.name}</Link>
        </li>
      ))}
    </ul>
  );
}

ExampleList.propTypes = propTypes;

export default ExampleList;
