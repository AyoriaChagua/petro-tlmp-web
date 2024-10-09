interface Props {
  type?: "dots" | "spiner"
  size?: "small" | "medium" | "large"
}
export default function Loader({size = "large", type = "dots"}: Props) {
  return (
    <div className={`flex w-full ${size  === "large" ? "h-[calc(100vh-10rem)]" : size === "medium" ? "h-52" : "h-32"} items-center justify-center`}><div className={type === "dots" ? "loader-dots" : "loader-spinner"}></div></div>
  )
}
