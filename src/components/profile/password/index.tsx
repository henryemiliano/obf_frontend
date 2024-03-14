import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from "../../../../styles/profile.module.scss";
import { FormEvent, useEffect, useState } from "react";
import profileService from "@/src/services/profileService";
import ToastComponent from "../../common/toast";

const PasswordForm = function () {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [color, setColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    profileService.fetchCurrent().then((password) => {
      setCurrentPassword(password.currentPassword);
      setNewPassword(password.newPassword);
    });
  }, []);

  const handlePasswordUpdate = async function (
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (newPassword != confirmPassword) {
      setToastIsOpen(true);
      setErrorMessage("As senhas não correspondem");
      setColor("bg-danger");
      setTimeout(() => setToastIsOpen(false), 1000 * 3);

      return;
    }

    if (currentPassword === newPassword) {
      setToastIsOpen(true);
      setErrorMessage("Não insira a senha anterior!");
      setColor("bg-warning");
      setTimeout(() => setToastIsOpen(false), 1000 * 3);

      return;
    }

    const res = await profileService.passwordUpdate({
      currentPassword,
      newPassword,
    });

    if (res === 204) {
      setToastIsOpen(true);
      setErrorMessage("Senha alterada com sucesso!");
      setColor("bg-success");
      setTimeout(() => setToastIsOpen(false), 1000 * 3);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    if (res === 400) {
      setToastIsOpen(true);
      setErrorMessage("Senha atual incorreta!");
      setColor("bg-danger");
      setTimeout(() => setToastIsOpen(false), 1000 * 3);
    }
  };

  return (
    <>
      <Form className={styles.form} onSubmit={handlePasswordUpdate}>
        <div className={styles.inputNormalDiv}>
          <FormGroup>
            <Label className={styles.label} for="currentPassword">
              SENHA ATUAL
            </Label>
            <Input
              name="currentPassword"
              type="password"
              id="currentPassword"
              placeholder="******"
              required
              minLength={6}
              maxLength={12}
              className={styles.input}
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.currentTarget.value);
              }}
            />
          </FormGroup>
        </div>
        <div className={styles.inputFlexDiv}>
          <FormGroup>
            <Label className={styles.label} for="newPassword">
              NOVA SENHA
            </Label>
            <Input
              name="newPassword"
              type="password"
              id="newPassword"
              placeholder="******"
              required
              minLength={6}
              maxLength={12}
              className={styles.inputFlex}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.currentTarget.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label className={styles.label} for="confirmNewPassword">
              CONFIRMAR NOVA SENHA
            </Label>
            <Input
              name="confirmNewPassword"
              type="password"
              id="confirmNewPassword"
              placeholder="******"
              required
              className={styles.inputFlex}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.currentTarget.value);
              }}
            />
          </FormGroup>
        </div>
        <Button className={styles.formBtn} outline type="submit">
          Salvar Alterações
        </Button>
      </Form>
      <ToastComponent
        color={color}
        isOpen={toastIsOpen}
        message={errorMessage}
      />
    </>
  );
};

export default PasswordForm;
