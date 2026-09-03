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
    max_score: number,
    difficulty_id: number,
    updated_at: number
}

export type unityScore = {
    token : string,
    pseudo : string,
    score: number,
    difficultyId : number
}
export type unityUser = {
    token : string,
    pseudo : string
}

export type apiScore = {
    scores: scoreDto[],
    difficulties: difficultyDto[],
    users: userDto[]
}