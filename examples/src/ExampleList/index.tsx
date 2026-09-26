import { Link } from "react-router-dom";
import { Example } from "../App/App";

type ExampleListProps = {
  examples: Example[];
};

function ExampleList({ examples }: ExampleListProps) {
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

export default ExampleList;
