export type difficultyDto = {
    id: number,
    label: string
}

export type userDto = {
    uid: string,
    pseudo: string
}

export type scoreDto = {
    user_uid: string,
    pseudo: string
    max_score: number,
    difficultyId: number,
    updatedAt: number
}

export type unityScore = {
    token : string,
    score: number
}

export type apiScore = {
    scores: scoreDto[],
    difficulties: difficultyDto[],
    users: userDto[]
}