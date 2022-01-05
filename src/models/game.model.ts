import {Column, DataType, Model, Table} from "sequelize-typescript";

interface GameCreationAttribute {
    userId: number
    time: number
    difficult: string,
    userLogin: string
}

@Table
export class GameModel extends Model<GameModel, GameCreationAttribute> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.INTEGER})
    userId: number

    @Column({type: DataType.INTEGER})
    time: number

    @Column({type: DataType.STRING})
    difficult: string

    @Column({type: DataType.STRING})
    userLogin: string
}