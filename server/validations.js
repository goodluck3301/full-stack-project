import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Սխալ էլ․ փոստ').isEmail(),
    body('password', 'Գաղտնաբառը պետք է պարունակի ամենաքիչը 6 սիմվոլ').isLength({min : 6}),
]

export const registerValidation = [
    body('email', 'Սխալ էլ․ փոստ').isEmail(),
    body('password', 'Գաղտնաբառը պետք է պարունակի ամենաքիչը 6 սիմվոլ').isLength({min : 6}),
    body('fullName', 'Անունը պետք է պարոնակի ամենաքիչը 3 սիմվոլ').isLength({min : 3}),
    body('avatarUrl', 'Սխալ հղում').optional().isURL(),
]

export const postCreateValidation = [
    body('title', 'Նշեք վերնագիրը').isLength({ min: 3 }).isString(),
    body('text', 'Նշեք տեքստը').isLength({ min: 10 }).isString(),
    body('tags', 'Սխալ ֆորմատի tag-եր').optional().isString(),
    body('imageUrl', 'Սխալ նկարի հղում').optional().isURL()
]