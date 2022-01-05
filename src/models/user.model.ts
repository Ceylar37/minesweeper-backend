import {Column, DataType, Model, Table} from "sequelize-typescript";

interface UserCreationAttribute {
    login: string
    password: string
}

@Table
export class UserModel extends Model<UserModel, UserCreationAttribute> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, unique: true})
    login: string

    @Column({type: DataType.STRING})
    password: string

    @Column({type: DataType.INTEGER, defaultValue: 0})
    easyGamesWonCount: number

    @Column({type: DataType.INTEGER, defaultValue: 0})
    mediumGamesWonCount: number

    @Column({type: DataType.INTEGER, defaultValue: 0})
    hardGamesWonCount: number

    @Column({type: DataType.TEXT, defaultValue: ''})
    token: string
}