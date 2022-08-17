import { TrashIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import Submission from "../../../libs/models/submission";
import PaginationButtons from "../../common/pagination-buttons";

interface ISubmissionsViewByTeamTextType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
  onDelete: (submission: Submission) => Promise<void>;
}

const SubmissionsViewByTeamTextType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewByTeamTextType
> = ({ currentPage, submissionsPaginated, onDelete }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Mission</th>
              <th>Answer</th>
              <th>Caption</th>
              <th>Points</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {submissionsPaginated.total === 0 && (
              <tr>
                <td className="text-center" colSpan={99}>
                  No submissions.
                </td>
              </tr>
            )}

            {submissionsPaginated.data.map((submission) => (
              <TextSubmissionItem
                key={submission.id}
                submission={submission}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-4">
        <PaginationButtons
          currentPage={currentPage}
          length={submissionsPaginated.last_page}
        />
      </section>
    </>
  );
};

interface ITextSubmissionItem {
  submission: Submission;
  onDelete: (submission: Submission) => Promise<void>;
}

const TextSubmissionItem: ComponentType<
  ComponentProps<"tr"> & ITextSubmissionItem
> = ({ submission, onDelete, ...rest }) => {
  const router = useRouter();
  const { isLoading, doAction } = useLoading();

  const gameId = router.query.gameId ?? "";

  const onDeleteClicked = async (submission: Submission) => {
    await doAction(onDelete(submission));
  };

  return (
    <tr
      key={submission.id}
      className={`hover ${isLoading && "animate-pulse"}`}
      {...rest}
    >
      <Link
        href={`/games/${gameId}/submissions/mission/${submission.mission_id}`}
      >
        <th className="link link-primary cursor-pointer">
          {submission.mission?.name}
        </th>
      </Link>

      <td>
        {typeof submission.answer_data === "string"
          ? JSON.parse(submission.answer_data).answer
          : submission.answer_data.answer}
      </td>

      <td>{submission.caption}</td>
      <td>{submission.mission?.point_value}</td>
      <td>
        <button
          onClick={() => onDeleteClicked(submission)}
          disabled={isLoading}
          className={`btn btn-error gap-2 ${isLoading && "loading"}`}
        >
          {!isLoading && <TrashIcon className="h-5 w-5" />}
          Delete
        </button>
      </td>
    </tr>
  );
};

export default SubmissionsViewByTeamTextType;