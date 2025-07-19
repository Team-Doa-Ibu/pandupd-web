import ErrorPage from "../components/pages/ErrorPage";
export default function CatchAll() {
  return <ErrorPage code={404} />;
}
