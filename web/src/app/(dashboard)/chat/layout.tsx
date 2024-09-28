export const Chatlayout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <div className="flex h-screen w-screen bg-[#212121]">
      {children}
    </div>
  );
};

export default Chatlayout;
