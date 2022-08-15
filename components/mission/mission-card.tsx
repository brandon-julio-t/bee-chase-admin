import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/use-loading";
import useService from "../../libs/hooks/use-service";
import Mission from "../../libs/models/mission";
import MissionService from "../../libs/services/mission-service";

interface IMissionCard {
  mission: Mission;
}

const availabilityTypes = ["available", "hidden", "expired"];

const MissionCard: ComponentType<ComponentProps<"div"> & IMissionCard> = ({
  mission,
  ...rest
}) => {
  const router = useRouter();
  const missionService = useService(MissionService);
  const { isLoading, doAction } = useLoading();

  const gameId = router.query.gameId as string;

  const onEdit = (mission: Mission) => {
    router.push(`/games/${gameId}/missions/${mission.id}/edit`);
  };

  const onDelete = async (mission: Mission) => {
    await toast.promise(
      doAction(async () => await missionService.delete(gameId, mission)),
      {
        loading: "Deleting mission...",
        success: "Mission deleted!",
        error: "Failed to delete mission",
      }
    );

    router.push(`/games/${gameId}/missions`);
  };

  return (
    <div
      className={`card w-full bg-base-100 shadow-xl ${
        isLoading && "animate-pulse"
      }`}
      {...rest}
    >
      <div className="card-body">
        <h2 className="card-title flex flex-wrap items-center justify-between capitalize">
          <span>{mission.name}</span>
          <small>({mission.point_value}) Points</small>
        </h2>

        <p>{mission.description}</p>

        <div className="divider"></div>

        <section className="flex items-center gap-2 capitalize">
          <div
            className={`h-4 w-4 rounded-full ${
              {
                0: "bg-green-500",
                1: "bg-yellow-500",
                2: "bg-base-300",
              }[mission.pivot.availability]
            }`}
          />

          <span>{availabilityTypes[mission.pivot.availability]}</span>
        </section>

        <section className="card-actions justify-end">
          <button
            disabled={isLoading}
            onClick={() => onEdit(mission)}
            className={`btn btn-secondary gap-2 ${isLoading && "loading"}`}
          >
            <PencilIcon className="h-5 w-5" /> Edit
          </button>
          <button
            disabled={isLoading}
            onClick={() => onDelete(mission)}
            className={`btn btn-error gap-2 ${isLoading && "loading"}`}
          >
            <TrashIcon className="h-5 w-5" /> Delete
          </button>
        </section>
      </div>
    </div>
  );
};

export default MissionCard;