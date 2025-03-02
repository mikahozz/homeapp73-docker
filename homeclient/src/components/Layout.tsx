import React from "react";
import { Container } from "reactstrap";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Container>
      <div>{children}</div>
    </Container>
  );
}

Layout.displayName = "Layout";
