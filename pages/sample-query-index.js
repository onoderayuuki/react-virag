import Link from "next/link"

export default function IndexPage() {
  return (
    <Link
      href={{
        pathname: "/sample-query",
        query: { id: "test" },
      }}
    >
      <a>About page</a>
    </Link>
  )
}