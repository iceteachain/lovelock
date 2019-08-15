import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MuiLink from "@material-ui/core/Link";
import Link from "src/Link";
import styled from "styled-components";
import { HomeLayout } from "src/components/layout";
import Main from "src/components/main/Main";
import "static/css/style.css";

class index extends Component {
  static getInitialProps({ reduxStore, req }) {
    // const isServer = !!req;
    // // DISPATCH ACTIONS HERE ONLY WITH `reduxStore.dispatch`
    // reduxStore.dispatch(serverRenderClock(isServer));
    return {};
  }
  render() {
    return (
      <Container maxWidth="xl">
        <HomeLayout title="Couple Lock">
          <Main />
        </HomeLayout>
      </Container>
    );
  }
}

export default index;
