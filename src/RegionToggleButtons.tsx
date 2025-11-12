import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  background-color: rgba(240, 240, 240, 0.9);
  border-radius: 9999px; /* pill shape */
  padding: 0.4rem;
  display: flex;
  gap: 0.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(6px);
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.active ? "rgb(25, 86, 175)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "rgb(60, 60, 60)")};
  border: none;
  padding: 0.5rem 1.4rem;
  border-radius: 9999px; /* pill shape */
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;

  &:hover {
    background-color: ${(props) =>
      props.active ? "rgb(22, 70, 145)" : "rgba(220, 220, 220, 1)"};
  }
`;

export default function RegionToggleButtons() {
  const [active, setActive] = useState("Gemeenten");

  return (
    <Wrapper>
      <Button
        active={active === "Gemeenten"}
        onClick={() => setActive("Gemeenten")}
      >
        Gemeenten
      </Button>
      <Button
        active={active === "Provincies"}
        onClick={() => setActive("Provincies")}
      >
        Provincies
      </Button>
    </Wrapper>
  );
}