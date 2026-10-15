// Type code below this line.
PennController.ResetPrefix(null)
// DebugOff()

SetCounter("inc", 1)

Header(
   // void
)
.log( "PROLIFIC_ID" , GetURLParameter("PROLIFIC_PID") )

Sequence(
    // "consent",
    // "background",
    "instructions-1",
    "instructions-2",
    "instructions-3",
    "practice-trial",
    "start",
    randomize("experimental-trial"),
    "end",
    SendResults(),
    "confirmation-prolific"
    )

// Consent form
newTrial("consent",
    defaultText.center().print(),
    newText("title", "<b>Consent</b><br><br>"),
    newText("consent-1", "Thank you very much for your participation! This experiment is part of a Cornell University scientific research project. Your decision to complete participant is voluntary. There is no way for us to identify you. The only information we will have, in addition to your responses, is the time at which you completed the survey. The results of the research may be presented at scientific meetings or published in scientific journals.<br><br>"),
    newText("consent-2", "<b>Clicking on the button below indicates that you are at least 18 years of age and agree to complete this experiment voluntarily.</b><br><br>"),
    newButton("wait", "Click here to continue").center().print().wait()
)

// collect participants' background information
newTrial("background",
    defaultText.center().print(),
    newText("title", "<b>Background Information</b><br><br>"),
    newTextInput("age", "")
        .cssContainer({"margin-bottom":"1em"})
        .log()
        .lines(1).length(3).size(40, 25)
    ,
    newText("age", "Please enter your age in years:  ").after(getTextInput("age"))
    ,
    newText("age_warning", "Please enter a valid age between 18 and 65.")
        .color("red")
        .cssContainer({"margin-bottom":"1em"})
        .hidden()
    ,
    newText("native", "Are you a native speaker of English?  ")
    ,
    newDropDown("native", "(select)")
        .cssContainer({"margin-bottom":"1em"})
        .add("Yes", "No")
        .before(getText("native"))
        .callback(
            getDropDown("native").test.selected("No")
                .success(getText("native_warning").visible())
                .failure(getText("native_warning").hidden())
        )
        .log()
        .print()
        .center()
    ,
    newText("native_warning", "You must be a native speaker to participate in this experiment.")
        .color("red")
        .cssContainer({"margin-bottom":"1em"})
        .hidden()
    ,
    newText("gender", "Please select your gender:  ")
    ,
    newDropDown("gender", "(select)")
        .cssContainer({"margin-bottom":"1em"})
        .add("Female", "Male", "Other")
        .before(getText("gender"))
        .center()
        .log()
        .print()
    ,
    newText("gender_other", "Please specify your gender:  ")
        .cssContainer({"margin-bottom":"1em"})
        .hidden()
    ,
    newTextInput("gender_other", "")
        .log()
        .lines(1).size(200, 25)
        .before(getText("gender_other"))
        .center()
        .hidden()
        .print()
    ,
    getDropDown("gender")
        .callback(
            getDropDown("gender").test.selected(2)
                .success(
                    getText("gender_other").visible(),
                    getTextInput("gender_other").visible().wait(),
                )
                .failure(
                    getText("gender_other").hidden(),
                    getTextInput("gender_other").hidden()
                )
        )
        .wait()
    ,
    newButton("wait", "Click here to continue").center().print()
        .callback(
            getTextInput("age").test.text(/^(1[8-9]|[2-5][0-9]|6[0-5])$/)
                .success(getText("age_warning").hidden())
                .failure(getText("age_warning").visible())
            ,
            getDropDown("native").test.selected("Yes")
                .success(getText("native_warning").hidden())
                .failure(getText("native_warning").visible())
        )
        .wait(
            // can only continue if age is between 18-65 AND native speaker response is Yes
            getTextInput("age").test.text(/^(1[8-9]|[2-5][0-9]|6[0-5])$/)
                .and(getDropDown("native").test.selected("Yes"))
            )
)


// Instructions
newTrial("instructions-1",
    defaultText.center().print(),
    newText("title", "<b>Instructions</b><br><br>"),
    newText("instructions-1", "In this experiment, you will read short descriptions of everyday situations. Each story will be followed by something a speaker says or asks about the situation.<br><br>"),
    newText("instructions-2", "Some statements are about <b>rules or permission</b>: what a person is allowed to do according to the rules in the situation.<br><br>"),
    newText("instructions-3", "Other statements are about <b>available information</b>: what could have happened (or what could happen), given what the people in the situation know.<br><br>"),
    newText("instructions-4", "These can sometimes be different. Something can be against the rules but still possibly have happened. Likewise, something can be permitted even when the available information shows that it did not happen.<br><br>"),
    newButton("wait", "Click here to continue").center().print().wait()
)

newTrial("instructions-2",
    defaultText.center().print(),
    newText("title", "<b>Instructions</b><br><br>"),
    newText("instructions-5", "In each trial, you will choose whether the speaker is talking about the <b>rules or permissions</b> or the <b>available information</b>.<br><br>"),
    newText("instructions-6", "The speaker intends only one of these two meanings. Choose the option that best matches what the speaker means.</b><br><br>"),
    newText("instructions-7", "Press the <b>F</b> key to select the option on the left.<br>Press the <b>J</b> key to select the option on the right.<br>You can also click on an answer to select it.<br><br>"),
    newText("instructions-8", "Base your judgment only on the story and what the speaker says or asks. Do <b>not</b> rate how likely the event itself is. Your task is to determine what the speaker is talking about.<br><br>"),
    newButton("wait", "Click here to continue").center().print().wait()
)

newTrial("instructions-3",
    defaultText.center().print(),
    newText("title", "<b>Instructions</b><br><br>"),
    newText("instructions-9", "Before starting the experiment, you will first be shown some practice trials.<br><br>"),
    newButton("wait", "Click here to continue").center().print().wait()
)

// training
Template('norming_practice_trials_whole_scenario_grouped.csv', row =>
    newTrial("practice-trial",
        newTimer("break", 500)
            .start()
            .wait()
        ,
        newVar("RT")
            .global()
            .set(v=>Date.now())
        ,
        newText("instructions", "<i>Read the following story and choose what the speaker means.<i><br><br>").center().print(),
        newText("sentence", row.context + "<br><br>") 
            .center()
            .print()
        ,
        newText(
            "response",
            "<b>Speaker:</b>&nbsp;&nbsp;" + row.whole_scenario_response
        )
            .cssContainer({
                "padding": "10px 18px",
                "border": "1px solid #aaa",
                "border-radius": "14px",
                "background-color": "#f7f7f7",
                "max-width": "750px",
                "margin": "0 auto 25px auto"
            })
            .center()
            .print()
        ,
        newText("question", row.whole_scenario_question + "<br>") 
            .center()
            .print()
        , 
        newCanvas("side-by-side", 500,100)
            .add(  0, 0, newCanvas("left", 250, 100)
                        .add( "center at 50%", "middle at 50%", 
                              newText("left", row.left_interpretation)
                                .css("color", "#C62828")
                                .css("center", "30px")
                                .center() )
                        .print())
            .add(  250, 0, newCanvas("right", 250, 100)
                        .add( "center at 50%", "middle at 50%", 
                              newText("right", row.right_interpretation)
                                .css("color", "#1565C0")
                                .css("center", "30px")
                                .center() )
                        .print())
            .center()
            .print()
            .log()
        ,
        newSelector("selection")
            .add(getText("left"), getText("right"))
            .keys("F", "J")
            .log()
            .wait()
        ,
        getVar("RT")
            .set(v=>Date.now()-v)
        ,
        getSelector("selection").test.selected(getText("left"))       
            .success(
                newText("choice", "<mark>You chose <i>\"" + row.left_interpretation + "\"</i>.</mark><br><br>")
                    .center()
                    .print()
            )
            .failure(
                newText("choice", "<mark>You chose <i>\"" + row.right_interpretation + "\"</i>.</mark><br><br>")
                    .center()
                    .print()
            )
        ,
        newText("feedback", "<mark>The option <i>\"" + row.expected_preference + "\"</i> is the correct answer.</mark><br><br>")
            .center().print()
        ,
        newButton("wait", "Click here to continue").center().print().wait()
        ,
    )
    .log("group" , row.group)
    .log("rt" , getVar("RT"))
    .log("practice_id", row.practice_id)
    .log("context",row.context)
    .log("response",row.whole_scenario_response)
    .log("left_interpretation",row.left_interpretation)
    .log("right_interpretation",row.right_interpretation)
    .log("scale_order",row.scale_order)
    .log("expected_preference",row.expected_preference)
);

// Instructions
newTrial("start",
    defaultText.center().print(),
    newText("title", "<b>Instructions</b><br><br>"),
    newText("instructions-1", "You have completed the practice phase of this experiment. <br><br>"),
    newText("instructions-2", "You will now start the next phase. You will no longer be provided any feedback for your answers.<br><br>"),
    newButton("wait", "Click here to begin").center().print().wait()
)

// experimental
Template('whole_scenario_stimulus.csv', row =>
    newTrial("experimental-trial",
        newTimer("break", 500)
            .start()
            .wait()
        ,
        newVar("RT")
            .global()
            .set(v=>Date.now())
        ,
        newText("instructions", "<i>Read the following story and choose what the speaker means.<i><br><br>").center().print(),
        newText("sentence", row.context + "<br><br>") 
            .center()
            .print()
        ,
        newText(
            "response",
            "<b>Speaker:</b>&nbsp;&nbsp;" + row.whole_scenario_response
        )
            .cssContainer({
                "padding": "10px 18px",
                "border": "1px solid #aaa",
                "border-radius": "14px",
                "background-color": "#f7f7f7",
                "max-width": "750px",
                "margin": "0 auto 25px auto"
            })
            .center()
            .print()
        ,
        newText("question", row.whole_scenario_question + "<br>") 
            .center()
            .print()
        , 
        newCanvas("side-by-side", 500,100)
            .add(  0, 0, newCanvas("left", 250, 100)
                        .add( "center at 50%", "middle at 50%", 
                              newText("left", row.left_interpretation)
                                .css("color", "#C62828")
                                .css("center", "30px")
                                .center() )
                        .print())
            .add(  250, 0, newCanvas("right", 250, 100)
                        .add( "center at 50%", "middle at 50%", 
                              newText("right", row.right_interpretation)
                                .css("color", "#1565C0")
                                .css("center", "30px")
                                .center() )
                        .print())
            .center()
            .print()
            .log()
        ,
        newSelector("selection")
            .add(getText("left"), getText("right"))
            .keys("F", "J")
            .log()
            .wait()
        ,
        getVar("RT")
            .set(v=>Date.now()-v)
        ,
    )
    .log("group" , row.group)
    .log("rt" , getVar("RT"))
    .log("item_id", row.item_id)
    .log("context",row.context)
    .log("response",row.whole_scenario_response)
    .log("left_interpretation",row.left_interpretation)
    .log("right_interpretation",row.right_interpretation)
    .log("scale_order",row.scale_order)
    .log("domain",row.domain)
    .log("temporal_orientation",row.temporal_orientation)
    .log("order",row.order)
    .log("response_condition",row.response_type)
    .log("response_syntax",row.syntax)
);

// end experiment
newTrial("end",
    defaultText.center().print(),
    newText("end-1", "Thank you for participating in this experiment! We appreciate your time and effort.<br><br>"),
    newText("end-2", "(Optional) Please use the space below to provide any feedback or suggestions: ")
        .cssContainer({"margin-bottom":"1em"})
    ,
    newTextInput("feedback", "")
        .cssContainer({"margin-bottom":"2em"})
        .log()
        .lines(0).size(500, 100)
        .center()
        .print()
    ,
    newText("end-3", "You <b>must</b> press the button to submit your responses.")
        .cssContainer({"margin-bottom":"1em"})
    ,
    newButton("wait", "Click here to finish").center().print().wait()
)

newTrial( "confirmation-prolific" ,
    // This is where you should put the link from the last step.
    newText("<p><a href='https://app.prolific.com/submissions/complete?cc=CP54NJIB'>Click here to validate your submission on Prolific</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)



