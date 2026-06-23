function Login() {
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Login</h2>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="text"
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full mt-2">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
            />
          </label>

          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary w-full">Login</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;