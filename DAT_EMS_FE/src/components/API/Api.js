import axios from "axios";

export const callApi = (method, url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (method === "get") {
        let res = await axios.get(url, {
          headers: {
            token:
              JSON.parse(localStorage.getItem("token")) ||
              JSON.parse(sessionStorage.getItem("token")),
          },
          withCredentials: true,
        });
        // console.log(method,url,res.data)
        resolve(res.data);
      } else {
        let res = await axios.post(url, data, {
          headers: {
            token:
              JSON.parse(localStorage.getItem("token")) ||
              JSON.parse(sessionStorage.getItem("token")),
          },
          withCredentials: true,
        });
        // console.log(method,url,res.data)
        resolve(res.data);

        // const response = await axios({
        //     url: url,
        //     method: "post",
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //         'token': JSON.parse(localStorage.getItem('token')) || JSON.parse(sessionStorage.getItem('token'))
        //     },
        //     data: data
        // });
        // console.log(response.data)
        // resolve(response.data)
      }
    } catch (e) {
      console.error("API ERROR:", e.response?.data || e);

      reject(e); // QUAN TRỌNG
    }
  });
};

export const Download = (url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .post(
          url,
          data,
          { responseType: "blob" },
          {
            headers: {
              token:
                JSON.parse(localStorage.getItem("token")) ||
                JSON.parse(sessionStorage.getItem("token")),
            },

            withCredentials: true,
          },
        )
        .then(function (res) {
          resolve(res.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const From = (url, data, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("image", data);
      formData.append("name", name);
      await axios
        .post(
          url,
          formData,

          {
            headers: {
              token:
                JSON.parse(localStorage.getItem("token")) ||
                JSON.parse(sessionStorage.getItem("token")),
              "content-type": "multipart/form-data",
            },

            withCredentials: true,
          },
        )
        .then(function (res) {
          resolve(res.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};
