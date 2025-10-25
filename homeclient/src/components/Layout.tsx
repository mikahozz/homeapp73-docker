import React from "react";
import { Container } from "reactstrap";
import { useBg } from "../hooks/useBg";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useBg();
  return (
    <Container>
      <div className="bg"></div>
      <div className="bg-overlay"></div>
      <div>{children}</div>
    </Container>
  );
}

Layout.displayName = "Layout";
