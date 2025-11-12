interface ImageProps {
  url: string;
  width?: string;
  height?: string;
}
const Image = ({ url, width, height }: ImageProps) => {
  return (
    <>
      <img className={`${width} ${height}`} src={url} alt="" />
    </>
  );
};

export default Image;
