import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const clickOnSubmitButton = () => {
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i,
  });
  userEvent.click(submitBtnElement);
};

describe("App", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("inputs should be initially empty", () => {
    expect(screen.getByRole("textbox").value).toBe("");
    expect(screen.getByLabelText("Password").value).toBe("");
    expect(screen.getByLabelText(/confirm password/i).value).toBe("");
  });

  test("should be able to type an email", () => {
    const { emailInputElement } = typeIntoForm({ email: "selena@gmail.com" });
    expect(emailInputElement.value).toBe("selena@gmail.com");
  });

  test("should be able to type a password", () => {
    const { passwordInputElement } = typeIntoForm({ password: "password!" });
    expect(passwordInputElement.value).toBe("password!");
  });

  test("should be able to type a confirm password", () => {
    const { confirmPasswordInputElement } = typeIntoForm({
      confirmPassword: "password!",
    });
    expect(confirmPasswordInputElement.value).toBe("password!");
  });

  describe("Error Handling", () => {
    test("should show email error message on invalid email", () => {
      expect(
        screen.queryByText(/the email you input is invalid/i)
      ).not.toBeInTheDocument();

      typeIntoForm({
        email: "selenagmail.com",
      });
      clickOnSubmitButton();

      expect(
        screen.queryByText(/the email you input is invalid/i)
      ).toBeInTheDocument();
    });

    test("should show password error if password is less than 5 characters", () => {
      typeIntoForm({ email: "selena@gmail.com" });

      expect(
        screen.queryByText(
          /the password you entered should contain 5 or more characters/i
        )
      ).not.toBeInTheDocument();

      typeIntoForm({ password: "123" });

      clickOnSubmitButton();

      expect(
        screen.queryByText(
          /the password you entered should contain 5 or more characters/i
        )
      ).toBeInTheDocument();
    });

    test("should show confirm password error if passwords don't match", () => {
      typeIntoForm({
        email: "selena@gmail.com",
        password: "12345",
      });

      expect(
        screen.queryByText(/the passwords don't match. try again/i)
      ).not.toBeInTheDocument();

      typeIntoForm({
        confirmPassword: "123456",
      });

      clickOnSubmitButton();

      expect(
        screen.queryByText(/the passwords don't match. try again/i)
      ).toBeInTheDocument();
    });

    test("should show no error message if every input is valid", () => {
      typeIntoForm({
        email: "selena@gmail.com",
        password: "12345",
        confirmPassword: "12345",
      });
      clickOnSubmitButton();

      expect(
        screen.queryByText(/the email you input is invalid/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          /the password you entered should contain 5 or more characters/i
        )
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/the passwords don't match. try again/i)
      ).not.toBeInTheDocument();
    });
  });
});
