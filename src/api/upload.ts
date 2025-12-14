import axiosClient from "./axiosClient";

export const uploadApi = {
  async single(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await axiosClient.post("/upload/single", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data; // trả { original, thumbnail, medium, large }
  },

  async multiple(files: File[]): Promise<{ urls: string[] }> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));

    const res = await axiosClient.post("/upload/multiple", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data; // { urls }
  },
};

export default uploadApi;
