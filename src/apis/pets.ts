import type { ApiResponse } from '@/types/common';
import type { PetForm, PetInfo, PetType } from '@/types/form';
import { formatDate } from '@/utils/calendar';

import { axiosInstance } from './axiosInstance';

export interface Pet {
  id: number;
  name: string;
  type: PetType;
  isFavorite: boolean;
}

export const getPets = async (memberId: number): Promise<Pet[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Pet[]>>(`/pets/list/${memberId}`);
    return response.data.content;
  } catch (error) {
    console.log('pets', error);
    throw error;
  }
};

export interface PetApiResponse {
  id: number;
  name: string;
  type: string;
  gender: string;
  birthDate: string; // ISO-8601 문자열
  isFavorite: boolean;
}

export const registerPet = async (memberId: number, form: PetForm): Promise<PetInfo> => {
  const payload = {
    memberId,
    name: form.name,
    type: form.species,
    gender: form.gender,
    birthDate: formatDate(form.birthDate), // string (YYYY-MM-DD)
    isFavorite: true,
  };

  const res = await axiosInstance.post<ApiResponse<PetApiResponse>>('/pets', payload);

  if (!res.data.success || !res.data.content) {
    throw new Error(res.data.message || '반려동물 등록 실패');
  }

  // ✅ API 응답 → 내부 도메인 타입으로 가공
  const petInfo: PetInfo = {
    id: res.data.content.id,
    name: res.data.content.name,
    species: res.data.content.type, // API는 type, 내부는 species
    gender: res.data.content.gender,
    birthDate: new Date(res.data.content.birthDate),
  };

  return petInfo;
};

export const putFavorite = async (petId: number) => {
  try {
    await axiosInstance.put('pets/favorites', {
      petId: petId,
      isFavorite: true,
    });
  } catch (error) {
    console.log('반려동물 즐겨찾기 수정 failed', error);
    throw error;
  }
};

// 상세 조회 API
export const getPetById = async (petId: number): Promise<PetApiResponse> => {
  const res = await axiosInstance.get<ApiResponse<PetApiResponse>>(`/pets/${petId}`);
  if (!res.data.success || !res.data.content) {
    throw new Error(res.data.message || '반려동물 상세 조회 실패');
  }
  return res.data.content;
};
