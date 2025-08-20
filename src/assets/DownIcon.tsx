import styled from "styled-components";

const Button = styled.button`
  height: auto;
  width: auto;
  background-color: rgba(0,0,0,0);
  border: none;
  padding: 1rem;
  cursor: pointer;
  color: grey;
  text-decoration: none;
`;

const DownIcon = ({ className, onClick }) => {
  return (
    <Button className={className} onClick={onClick}>
      <i className="ri-arrow-down-wide-line ri-3x"></i>
    </Button>
  );
};

export default DownIcon;
