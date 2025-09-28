export const PET_SPECIES_KO = ['강아지', '고양이', '햄스터', '조류', '파충류', '어류'] as const;
export type PetSpeciesKo = (typeof PET_SPECIES_KO)[number];

export const PET_GENDERS_KO = ['남아', '여아', '중성'] as const;
export type PetGenderKo = (typeof PET_GENDERS_KO)[number];

export interface PetBase {
  name: string;
  species: PetSpeciesKo;
  gender: PetGenderKo;
  birthDate: Date; // 프론트는 Date 객체 사용
  isFavorite: boolean;
}

// 서버 전송용 Request DTO
export interface PetRequestDto extends Omit<PetBase, 'isFavorite'> {
  memberId: number;
}

// 서버 응답용 Response DTO
export interface PetResponseDto extends PetBase {
  id: number;
}

// UI 전용 Form 모델 (isFavorite, id 없음)
export interface PetForm extends Omit<PetBase, 'isFavorite'> {}

// 전역/Redux 등에 저장되는 UI 모델
export interface PetInfo extends PetBase {
  id: number;
}
