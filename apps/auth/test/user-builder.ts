import DocumentBuilder from './document-builder';
import CreateUserDto from '../src/user/dto/create-user.dto';
import UpdateUserDto from '../src/user/dto/update-user.dto';

export default class UserBuilder extends DocumentBuilder<CreateUserDto, UpdateUserDto> {
  activate(activationLink: string) {
    if (activationLink) this.currentValue.activationLink = activationLink;
    this.addTask(this.activateUser.bind(this));
    return this;
  }

  async activateUser() {
    if (this.isFailed) return;
    if (!this.currentValue.activationLink) {
      this.fail();
      return;
    }

    this.currentValue.isActivated = (
      await this.sendRequest(this.currentValue.activationLink)
    ).isActivated;
    if (!this.currentValue.isActivated) {
      this.fail();
    }
  }
}
