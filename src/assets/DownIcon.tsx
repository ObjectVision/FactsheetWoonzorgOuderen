import styled from "styled-components";

const Button = styled.button`
  height: auto;
  width: auto;
  background-color: rgba(0,0,0,0);
  border: none;
  padding: 1rem;
  cursor: pointer;
  color: black;
  text-decoration: none;
`;

const DownIcon = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <i className="ri-arrow-down-wide-line"></i>
    </Button>
  );
};

export default DownIcon;
