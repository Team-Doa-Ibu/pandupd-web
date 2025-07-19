import ErrorPage from "../../components/pages/ErrorPage";
export default function Forbidden() {
  return <ErrorPage code={403} />;
}
