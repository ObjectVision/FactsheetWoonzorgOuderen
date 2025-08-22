import React from "react";
import styled from "styled-components";
import {DonutChart} from "./visuals/donut"

const TitleContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color:rgba(2, 1, 1, 0.7);
  background-color: rgba(255,255,255,0.9);
`;

interface ChildProps {
  title:string
}

export default function TitleBox({title}:ChildProps) {
  return (
    <TitleContainer>
      <h1>{title}</h1>
    </TitleContainer>
  );
}