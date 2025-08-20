import styled from "styled-components";

const Button = styled.button`
  height: 32px;
  width: 32px;
  background-color: none;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
`;

export const CloseIcon = ({}) => {
  return (
    <div>
      <Button>
        {" "}
        <i className="ri-close ri-1x"></i>{" "}
      </Button>
    </div>
  );
};
