import { ServerRunner } from "@/features/server/singletons/ServerRunner";
import { LOGGER } from "@/features/server/utils/logger";
import { IApiServerUpdatePayload } from "@/features/state/types/IApiServerUpdatePayload";

// Required to make EventStream work
export const runtime = "nodejs";
// Required to make EventStream work
export const dynamic = "force-dynamic";

// Note: All usage of the ServerRunner _must_ be from this endpoint to not create multiple singletons

export const GET = async (req: Request) => {
  LOGGER.info("[state] EventStream opened");

  const serverRunner = ServerRunner.getInstance();

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const _unsubscribe = serverRunner.subscribe((state) => {
    const data = JSON.stringify(state);

    writer.write(encoder.encode(`event: message\ndata: ${data}\n\n`));

    LOGGER.info("[state] Sent message event for status:", state.status);
  });

  req.signal.addEventListener("abort", async () => {
    _unsubscribe();

    await writer.close();

    LOGGER.info("[state] EventStream closed");
  });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
};

export const POST = async (req: Request) => {
  const serverRunner = ServerRunner.getInstance();

  const body = (await req.json()) as IApiServerUpdatePayload;

  switch (body.action) {
    case "start":
      LOGGER.info("[state] Starting server...");

      await serverRunner.start();

      LOGGER.info("[state] Server started");
      break;
    case "stop":
      LOGGER.info("[state] Stopping server...");

      await serverRunner.stop();

      LOGGER.info("[state] Server stopped");
      break;
    case "update":
      LOGGER.info("[state] Updating server...");

      await serverRunner.update(body.validate);

      LOGGER.info("[state] Server updated");
      break;
    default:
      LOGGER.error(
        "[state] POST action not recognized, payload received:",
        body,
      );
  }

  return new Response();
};
