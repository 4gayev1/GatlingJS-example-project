import {
  simulation,
  scenario,
  exec,
  StringBody,
  rampUsersPerSec,
  constantUsersPerSec,
  getEnvironmentVariable,
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";


const rampUpTime = parseInt(getEnvironmentVariable("RAMPUP") || "10");
const threadsPerSec = parseInt(getEnvironmentVariable("USERS") || "5");
const measurement = parseInt(getEnvironmentVariable("TIME") || "60");


export default simulation((setUp) => {
  const test = exec(
    http("Login")
      .post("/auth/login")
      .body(StringBody('{"username": "emilys", "password": "emilyspass"}'))
      .check(status().is(200))
      .asJson(),
  );

  const httpProtocol = http.baseUrl("https://dummyjson.com");

  const Login = scenario("Login Scenario").exec(test);

  setUp(
    Login.injectOpen(
      rampUsersPerSec(0).to(threadsPerSec).during(rampUpTime),
      constantUsersPerSec(threadsPerSec).during(measurement),
    ),
  ).protocols(httpProtocol);
});
