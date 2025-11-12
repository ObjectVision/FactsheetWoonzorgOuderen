import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 1000;
`;

const Button = styled.button`
  height: auto;
  width: auto;
  background-color: ${(props) =>
    props.active ? "rgb(25, 86, 175)" : "rgba(230, 230, 230, 1)"};
  color: ${(props) => (props.active ? "white" : "rgba(60, 60, 60, 1)")};
  border: none;
  padding: 0.4rem 1.4rem;
  border-radius: 9999px; /* pill shape */
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: background-color 0.25s, color 0.25s;

  &:hover {
    background-color: ${(props) =>
      props.active ? "rgb(22, 70, 145)" : "rgba(210, 210, 210, 1)"};
  }
`;

export default function RegionToggleButtons() {
  const [active, setActive] = useState("Gemeenten");

  return (
    <Container>
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
    </Container>
  );
}