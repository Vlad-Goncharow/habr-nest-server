import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';

@Injectable()
export class RolesService {

  constructor(@InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UserRoles) private roleUserRoles: typeof UserRoles){}

  //create new role
  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto)

    return role
  }

  //load role by role value
  async getRoleByValye(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } })

    if (!role) {
      throw new HttpException('Такой роли не существует или она не найдена', HttpStatus.NOT_FOUND)
    }
    
    return role
  }

  //load role by id
  async getRoleById(roleId:string){
    const role = await this.roleRepository.findByPk(roleId)

    if (!role) {
      throw new HttpException('Такой роли не существует или она не найдена', HttpStatus.NOT_FOUND)
    }

    return role
  }
}
