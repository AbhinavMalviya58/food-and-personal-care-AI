interface ErrorProps {
    text: string;
  }
  
  const Error: React.FC<ErrorProps> = ({ text }) => {
    return (
      <div className='text-red-600 text-sm'>
        <p>{text}</p>
      </div>
    );
  };
  
  export default Error;