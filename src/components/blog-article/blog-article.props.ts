import { Context } from "elysia";
import type { PostProps } from "../../sharedtypes";
import { getServerProps } from "../lib/shared/getServerProps";

export const fetchblogpost = async(ctx: Context) => {
  const {id} = getServerProps<PostProps>(ctx);
  return (
    await (
      await fetch('https://jsonplaceholder.typicode.com/posts/'+id)
    ).json()
  );
}