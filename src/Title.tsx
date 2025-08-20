import React from "react";
import styled from "styled-components";

const TitleContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.9);
`;


const TitleBox: React.FC<{ title?: string }> = ({
  title = "Wonen & Zorg Limburg",
}) => {
  return (
    <TitleContainer>
      <h1><i className="ri-accessibility-fill"></i>
       {title} </h1>
    </TitleContainer>
  );
};

export default TitleBox;
