export const Chatlayout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <div className="flex h-screen w-screen bg-foreground">
      {children}
    </div>
  );
};

export default Chatlayout;
